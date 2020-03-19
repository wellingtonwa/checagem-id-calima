const fs = require('fs');
const path = require('path');
const ioUtils = require('./utils/ioUtils');

const REGEX_PADRAO_NOME = { '.tsx': /^[A-Z]\w*/, '.ts': /^[a-z]\w*/ };
const REGEX_ROUTES = /.*(routes).ts$/i;
const REGEX_MENU = /.*(menu).ts$/i;

const options_tsx = { 
    initial_path: 'D:/sistemas/calima-react/react/src/views/pages/',
    extname: '.tsx',
    arquivos_encontrados: [],
};

const options_ts = {
    initial_path: 'D:/sistemas/calima-react/react/src/models',
    extname: '.ts',
    arquivos_encontrados: [],
}

const options_menu_ts = {
    initial_path: 'D:/sistemas/calima-react/react/src',
    extname: '.ts',
    arquivos_encontrados: [],
}

const varrerDiretorios = (caminho, extensao_arquivo, arquivos_encontrados) => {
    
    const conteudo_pasta = fs.readdirSync(caminho, { withFileTypes: true })
    for(let item_pasta of conteudo_pasta) { 
        if (item_pasta.isDirectory()) {
            const new_path = path.join(caminho, item_pasta.name);
            varrerDiretorios(new_path, extensao_arquivo, arquivos_encontrados);
        } else {
            
            if(path.extname(item_pasta.name) == extensao_arquivo) {
                if (!item_pasta.name.match(REGEX_PADRAO_NOME[extensao_arquivo])) {
                    console.log(`O arquivo ${item_pasta.name} deve iniciar com letra minúscula.`);
                }
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
    const REGEX_PATH_MENU = /'([\w0-9]*)'(?!;)/gm;
    const REGEX_CAMINHO_MENU = /(?<=to: '\/[a-z]{3}\/)(.*)?(?=')/gm;
    run(options_tsx);
    run(options_ts);
    for(let arquivo of options_tsx.arquivos_encontrados) {
        let conteudo = await ioUtils.getFileContent({filePath: arquivo});
        let array1;
        while ((array1 = regex1.exec(conteudo)) !== null) {
            const input = array1[0].replace(/(\n|\r\n| {2,})/g, ' ');
            if (input.indexOf('id=') < 0) {
                console.log(`ID não encontrado ${input}. Arquivo: ${arquivo}`);
            }
        }
        
    }

    run(options_menu_ts);

    // console.log(options_menu_ts.arquivos_encontrados)
    // console.log(path.basename('D:\\sistemas\\calima-react\\react\\src\\models\\dtos\\mlf\\mfMenu.ts').match(REGEX_ROUTES))
     let rotas = options_menu_ts.arquivos_encontrados.filter(it => path.basename(it).match(REGEX_ROUTES));
     let menu = options_menu_ts.arquivos_encontrados.filter(it => path.basename(it).match(REGEX_MENU));
    // let rotas = ['D:\\sistemas\\calima-react\\react\\src\\views\\pages\\mlf\\mlfRoutes.ts']:
    let arquivos_no_menu = []
    for(let arquivo of rotas) {
        let conteudo = await ioUtils.getFileContent({filePath: arquivo});
        let array1;
        while ((array1 = REGEX_PATH_MENU.exec(conteudo)) !== null) {
            arquivos_no_menu.push(array1[1].toLowerCase());
            continue;
        }
    }

    arquivos_no_menu.sort().forEach(it => console.log("rota: ", it));

    for(let arquivo of menu) {
        let conteudo = await ioUtils.getFileContent({filePath: arquivo})
        let array1;
        while ((array1 = REGEX_CAMINHO_MENU.exec(conteudo)) !== null) {
            arquivos_no_menu.push(array1[1]);
            continue;
        }
    }

    // console.log(arquivos_no_menu)

    for(let arquivo of options_tsx.arquivos_encontrados) {
        let aux_arquivo_menu = path.basename(arquivo, '.tsx').toLowerCase();
        if (!arquivos_no_menu.find(it => it == aux_arquivo_menu)) {
            console.log(`A tela ${aux_arquivo_menu} não está no menu!`);
        }
    }

})()