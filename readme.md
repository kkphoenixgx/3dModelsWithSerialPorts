# Simulador de arduino integrado com modelo 3d

Lembrando que a máquina precisa do node para rodar.

*Para rodar:*

> `npm install`

E quando instalar as dependências:

> `npm start`

! Quero lembrar que está em *desenvolvimento*, isso é um *protótipo*. Aqui vai algumas considerações:

- Provavelmente vai dar erro na simulação do arduino, preciso testar isso em uma máquina que possua a IDE para integrar.

- Os modelos estão travando ao movimenta-los, movimentar eles com o mouse foi uma feature que eu decidi implementar por mim mesmo e que precisa de polimento no código.

## Do processo de interação entre essa aplicação e a IDE

O servidor roda um microserviço via comando de terminal, se você rodar no diretório da aplicação:

> `node serial-service.js -p <path> -r <rate>`

Ele cria a porta serial com o path que você passar, exemplo: /dev/ttyUSB0 e com o rate que você passar, ex: "9600"...

Eu já ajustei o front para mandar com essas configurações, embora, claro que, no futuro, o usuário poderá passar isso como parâmetro, até para o usuário conseguir configurar isso.

Quando for interagir com a IDE, tem que ver como vai ser, se via [web serial api](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) ela consegue se comunicar sem requisitar o backend ou se vai precisar se comunicar via requisições.
