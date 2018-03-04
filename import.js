const _ = require('lodash')
const commander = require('commander')
const fs = require('fs-extra')
const path = require('path')

const ImportModel = require('./mongo-model')

let template_code_root_path = ''

// Command Line Parameters Parsing
commander.version("2.0")
    .option('-t, --templates [value]', 'templates name')
    .parse(process.argv)

Run()

async function Run() {
    try {
        // parameta check
        if (!commander.templates)
            return console.log('Templates name must be specified')

        // directory exist check
        const template_path = path.join(__dirname, commander.templates)
        const stat = await fs.stat(template_path)
        if (!stat.isDirectory())
            return console.log('Import template must be an directory')

        // import template meta information
        const template_meta = fs.readJsonSync(path.join(template_path, 'meta.json'))
        const template_id = await ImportModel.createTemplateMeta(template_meta)

        // import template code
        template_code_root_path = path.join(template_path, 'codes')
        await importTemplateDir(template_code_root_path, template_id)
        console.log('Done..!')
        process.exit(0)
    } catch (error) {
        console.log('Import error: ' + error)
        process.exit(-1)
    }
}


/**
 * import template code in specified collection in mongo
 *
 * @param {String} dir_path template code path
 * @param {ObjectId} template_id template id in mongo 
 * @return null
 */
async function importTemplateDir(dir_path, template_id) {
    // console.log(template_id)
    try {
        const entries = await fs.readdir(dir_path)

        for (let i = 0; i < entries.length; i++) {
            const file = entries[i]
            // get new entry full path
            const file_path = path.join(dir_path, file)

            // get entry's detail information
            const file_stat = await fs.stat(file_path)
            let parent = '/' + path.relative(template_code_root_path, dir_path)
            parent = parent.replace(/\\/g, '/', 'g')

            if (file_stat.isDirectory()) {
                await ImportModel.importTemplateCode(template_id, file, 'dir', parent, file_path)
                // call it recursive
                await importTemplateDir(file_path, template_id)
            }
            else if (file_stat.isFile()) {
                // here we need push this file to mongo
                await ImportModel.importTemplateCode(template_id, file, 'file', parent, file_path)
            }
            else {
                console.log(`import ${file_path} met a problem, skiped to insert to database`)
            }
        }
    } catch (error) {
        console.log('List dir caught an error: ' + error)
    }
}