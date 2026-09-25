# Portfólio Bandeirantes

Duas páginas HTML que leem da mesma base:

- `index.html`: landing page do portfólio (marcas, categorias, produtos, "Meu portfólio").
- `admin.html`: portal do time de MKT. Tudo o que é salvo aqui aparece na landing page em até 20 segundos, sem publicar nada de novo.

A base é uma planilha Google e as imagens ficam numa pasta do Drive, as duas ligadas por um Apps Script.

## 1. Backend (uma vez, uns 10 minutos)

1. Acesse script.google.com, crie um projeto e cole o conteúdo de `apps-script/Codigo.gs`.
2. Selecione a função `setup` e clique em Executar. Autorize. No log aparecem os links da planilha e da pasta de imagens.
3. Engrenagem (Configurações do projeto) > Propriedades do script > Adicionar: `SENHA` = a senha do time de MKT.
4. Implantar > Nova implantação > tipo App da Web.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Copie a URL que termina em `/exec` e cole em `js/config.js`.

Sempre que alterar o `Codigo.gs`, use Implantar > Gerenciar implantações > editar > Nova versão. Assim a URL continua a mesma.

## 2. Publicar o site

Suba a pasta inteira (menos `apps-script/` e `ferramentas/`) no GitHub Pages ou em qualquer hospedagem estática. Abrir o `index.html` direto do computador também funciona.

## 3. Primeira carga

Abra `admin.html`, entre com a senha e clique em **Carregar base inicial**. Isso grava os 381 SKUs e as 54 marcas na planilha.

## 4. Imagens

- Uma a uma: aba Produtos, clique no quadrado da imagem. Se o mesmo EAN estiver em mais de um código (caixa e unidade), a imagem vai para todos.
- Em lote: rode `ferramentas/chupacabra.py` e arraste a pasta `saida/imagens` na aba **Importar imagens**. Confira manualmente a pasta `imagens_revisar/` antes de subir.
- O admin reduz cada imagem para até 1200 px (WEBP) antes de enviar.

Chupa-cabra:
```
pip install playwright pandas openpyxl requests
python -m playwright install chromium
python chupacabra.py
```

## 5. Rotina

- Cadastro novo do sistema: aba **Atualizar cadastro**, suba o `Cadastro_Produto.xlsx`. O portal cria os novos, oculta os suprimidos e mantém nomes, imagens e selos editados pelo MKT.
- A planilha Google também pode ser editada direto. A landing page reflete a mudança em até 10 minutos (tempo do cache). Uma alteração pelo admin atualiza na hora.

## Pontos de atenção

- **Política do Google Workspace:** se o domínio da GJA bloquear compartilhamento "qualquer pessoa com o link" ou implantação para "Qualquer pessoa", as imagens não aparecem para quem estiver fora da empresa. Nesse caso, rode o Apps Script numa conta que permita isso ou peça a liberação para essa pasta ao TI.
- **Senha:** o `admin.html` fica público, mas nada é gravado sem a senha, que é conferida no servidor. Para trocar a senha, altere a propriedade `SENHA`.
