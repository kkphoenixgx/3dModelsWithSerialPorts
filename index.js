const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const path = require("path");

const app = express();

let collectionAgents = [];

// ----------- Middlewares -----------

app.use(express.json());

// APENAS PARA DESENVOLVIMENTO
app.use(cors());

// Servindo arquivos estáticos
app.use("/static", express.static(path.join(__dirname, "public", "static")));
app.use("/models", express.static(path.join(__dirname, "public", "models")));


// ----------- Routes -----------

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/agents", (req, res) => {
    const validAgents = collectionAgents.filter(agent => agent !== undefined);

    res.status(200).json(validAgents);
});
app.post("/changePosition", (req, res) => {
    const agents = req.body;  // Aqui o req.body é o array completo de agentes

    if (!agents || !Array.isArray(agents)) {
        return res.status(400).json({ error: "Faltando ou formato inválido para o array de agentes" });
    }

    agents.forEach(agent => {
      const { id, name, x, y, z } = agent;

      if (id == null || !name || x == null || y == null) {
        return res.status(400).json({ error: "Faltando parâmetros na requisição de algum agente" });
      }

      if (!collectionAgents[id]) {
        collectionAgents[id] = { id, name, x, y };
      } else {
        collectionAgents[id].name = name;
        collectionAgents[id].x = x===undefined? 0 : x;
        collectionAgents[id].y = y===undefined? 0 : y;
        collectionAgents[id].z = z===undefined? 0 : z;
      }
    });

    console.log("Coleção atualizada:", collectionAgents);

    res.status(200).json({
        message: "Posição dos agentes atualizada com sucesso",
        agents: collectionAgents.filter(Boolean), // Remove `undefined` do array
    });
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
        return res
          .status(500)
          .json({ error: "Erro ao executar o comando, Verifique a versão do seu node." });
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
