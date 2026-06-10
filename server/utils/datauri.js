import datauriParser from "datauri/parser.js"

import path from "path"

const getDataURi=(file)=>{

    if(!file||!file.buffer){return null}
    const parser=new datauriParser();
    const extName=path.extname(file.originalname).toString();
    return parser.format(extName,file.buffer)
}

export default getDataURi