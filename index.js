const express = require("express");
const { exec } = require("child_process");
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());

// APENAS PARA DESENVOLVIMENTO
app.use(cors());


app.use('/static', express.static(path.join(__dirname, 'public', 'static')));
app.use('/models', express.static(path.join(__dirname, 'public', 'models')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/createPort", (req, res) => {
    const { rate, path } = req.body;
    
    if (!path || !rate) {
        return res.status(400).json({ error: "Faltando parâmetros path ou rate" });
    }

    // Construindo o comando para rodar o script `serial-service.js`
    const command = `node serial-service.js -p ${path} -r ${rate}`;

    try {
        // Executando o comando
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error("Erro no comando:", err);
                return res.status(500).json({ error: "Erro ao executar o comando, Verifique a versão do seu node." });
            }

            // Logando o stdout e stderr
            if (stdout) console.log(`stdout: ${stdout}`);
            if (stderr) console.log(`stderr: ${stderr}`);

            res.status(200).json({ message: "Porta serial criada com sucesso!" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});

app.listen(3000, () => {
    console.log("Servidor Express rodando na porta 3000");
});