const fs = require('fs');
const path = require('path');
const ioUtils = require('./utils/ioUtils');

const options = { 
    initial_path: 'D:/sistemas/calima-react/react/src/views/pages/',
    extname: '.tsx',
    arquivos_encontrados: [],
};

const varrerDiretorios = (caminho, extensao_arquivo, arquivos_encontrados) => {

    const conteudo_pasta = fs.readdirSync(caminho, { withFileTypes: true })
    for(let item_pasta of conteudo_pasta) { 
        if (item_pasta.isDirectory()) {
            const new_path = path.join(caminho, item_pasta.name);
            varrerDiretorios(new_path, extensao_arquivo, arquivos_encontrados);
        } else {
            if(path.extname(item_pasta.name) == extensao_arquivo) {
                arquivos_encontrados.push(path.join(caminho, item_pasta.name));
            }
        }
    }

}

const run = (opts) => {
    varrerDiretorios(opts.initial_path, opts.extname, opts.arquivos_encontrados);
}

(async () => {
    const regex1 = /<(InputGroupInline|CustomInput|\w*IS)(.|\r\n)*?\/>/gm;
    run(options);
    for(let arquivo of options.arquivos_encontrados) {
        let conteudo = await ioUtils.getFileContent({filePath: arquivo});
        let array1;
        while ((array1 = regex1.exec(conteudo)) !== null) {
            const input = array1[0].replace(/(\n|\r\n| {2,})/g, ' ');
            if (input.indexOf('id=') < 0) {
                console.log(`ID não encontrado ${input}. Arquivo: ${arquivo}`);
            }
        }
        
    }
})()