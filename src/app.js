const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if(!isUuid(id)){
    return response.status(400).send();
  }

  const repositoryOrigem = repositories.find(repository => repository.id === id);

  if(repositoryOrigem === undefined){
    return response.status(400).send();
  }

  repositoryOrigem.title = title;
  repositoryOrigem.url = url;
  repositoryOrigem.techs = techs

  return response.json(repositoryOrigem);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).send();
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0){
    return response.status(400).send();
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
 
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid repository ID!'});
  }

  const repository = repositories.find(repository => repository.id === id);

  if(!repository){
    return response.status(400).json({ error: 'Repository not found!'});
  }

  repository.likes++;

  return response.status(201).json(repository);

});

module.exports = app;
