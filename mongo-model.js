const mongoose = require('mongoose')
const TemplateModel = require('./TemplateMeta')
const TemplateCodeModel = require('./TemplateCode')

const fs = require('fs-extra')

// mongo initialization
mongoose.Promise = Promise
const mongodb_host = 'localhost'
const mongo_uri = `mongodb://${mongodb_host}/templates`
mongoose.connect(mongo_uri)
let global_i = 0

// ===================================== Function Implementation =============================================

/**
 * import template code in specified collection in mongo
 *
 * @param {ObjectId} template_id template id in mongo 
 * @param {String} name file name
 * @param {String} type file type, [file/dir]
 * @param {String} parent file parent name, absolute path
 * @param {String} file_path file full path
 * @return null
 */
async function importTemplateCode(template_id, name, type, parent, file_path) {

    let data = ''
    
    try {
        // read file and get file contents
        if (type === 'file')
            data = await fs.readFile(file_path)

        // if (data.length > 16700000)
        //     console.log(file_path)
        // console.log('name: ' + name + '\t  type:' + type + '\t  parent: ' + parent)
        
        // create and save a code doc
        const code = new TemplateCodeModel({
                template_id,
                name,
                type,
                parent,
                data
            })
        await code.save()
        console.log(global_i++)
    } catch (error) {
        console.log('import file to mongo caught an error: ' + error)
    }
}

/**
 * import template code in specified collection in mongo
 *
 * @param {Object} template_meta template meta info, include name, desc, tags and docker image name information
 * @return {ObjectId}} saved template meta doc's id in mongo
 */
async function createTemplateMeta(template_meta) {

    // check if this template meta is already existed
    const query = await TemplateModel.find({name: template_meta.name})
    if (query.length !== 0 ) throw new Error('Faied to import: ' + template_meta.name + ' have already existed.')
    
    const template = new TemplateModel({
        name: template_meta.name,
        desc: template_meta.desc,
        tags: template_meta.tags,
        docker_image: template_meta.image_name
    })

    const saved_template = await template.save()
    console.log(`${saved_template.name} [id:${saved_template._id}] have been imported.`)
    return saved_template._id
}

module.exports = {
    importTemplateCode,
    createTemplateMeta
}