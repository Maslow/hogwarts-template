# hogwarts templates import tool


# Usage  
```sh
    docker run -it --rm -v $(pwd):/app --network=server_backend node bash
    # execute following in container just created
    cd /app
    node import.js -t [TemplateFolderName]
```