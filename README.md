# Batch Messenger for WhatsApp

## Necessário ter instalado

* NodeJS
* Google Chrome

## Preparando o ambiente

1. Clone este repositório localmente e navegue até sua pasta raíz (***batchmessenger***).

2. Exporte seus contatos do [Google Contacts](https://contacts.google.com) em formato CSV e jogue o arquivo dentro da pasta raiz do projeto.

3. Baixe o ZIP com o webdriver específico para a sua versão de Google Chrome [neste site](https://chromedriver.chromium.org/downloads), extraia-o e cole o executável dentro da pasta raiz do projeto.

> ATENÇÃO: É importante que a versão do webdriver seja a mesma do navegador. Para saber a versão do seu navegador, basta copiar e colar a URL a seguir em uma nova aba: ``chrome://settings/help``

## Executando a solução

Para rodar o programa, abra um terminal na pasta raiz do projeto e digite os seguintes comandos:

```bash
npm install # Instala as dependências do projeto
npm start # Inicia a aplicação
```

> DICA: Só é preciso executar o comando ``npm install`` apenas na primeira vez em que estiver rodando o programa na máquina.

Assim que a aplicação entrar em execução, uma nova janela do Google Chrome aparecerá na página do WhatsApp Web e você deverá logar com a conta desejada.

Uma vez logado no WhatsApp, basta digitar ``http://localhost:4000`` em uma nova aba e começar a mandar mensagens!

> ATENÇÃO: Ao clicar para enviar uma mensagem, ela levará um tempo para ser redirecionada a todos os contatos da sua lista, a depender do tamanho desta. Enquanto esse processo estiver ocorrendo, NÃO MEXA na interface do WhatsApp Web, caso contrário, erros inesperados poderão acontecer.

> AVISO: A interface do site do programa ficará travada durante o envio das mensagens, impossibilitando seu uso. Assim que o processo for finalizado, uma mensagem será enviada ao navegador informando seu fim e a interface voltará a ficar disponível para uso.
