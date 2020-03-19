const fs = require('fs');
const path = require('path');
const ioUtils = require('./utils/ioUtils');

const options_tsx = { 
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
                if (!item_pasta.name.match(REGEX_PADRAO_NOME[extensao_arquivo])) {
                    console.log(`O arquivo ${item_pasta.name} está fora do padrão.`);
                }
                arquivos_encontrados.push(path.join(caminho, item_pasta.name));
            }
        }
    }

}

(async () => {

})();