const { request } = require('express')
const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json()) //sempre antes das rotas

/*
    GET         - buscar informação no back-end
    POST        - criar informação no back-end
    PUT/PATCH   - alterar/atualizar informação no back-end
    DELETE      - deletar informação no back-end 
    MIDDLEWARE  - interceptador => tem o poder de parar ou alterar dados da requisição
    next        - continua o fluxo da aplicação
*/

const users = [] // Criar array para armazenar usuários;

const checkUserId = (request, response, next) => { // MIDDLEWARE
    const {id} = request.params // Obter o id;

    const index = users.findIndex( user => user.id === id) // Descobrir o index do id fornecido; posição no array

    if(index < 0) {
        return response.status(404).json({error: "user not found"}) // Retornar status 404 e mensagem de "User not found",
                                                                     // no caso de o id não existir dentro do array (retorno -1);
    }

    request.userIndex = index // Adicionar uma informação no index
    request.userId = id // Adicionar uma informação no id

    next()
}

app.get('/users', (request, response) => { // Ciar e Configurar rota(get) que exiba todos os usuários armazenados no array;
    return response.json(users)
})

app.post('/users', (request, response) => { // Criar rota(post) que insira usuários no array:
    const {name, age} = request.body // Envio pelo Body;
    const user = {id: uuid.v4(), name, age} // Cada usuário deverá ter um ID único/Usar Biblioteca uuid;

    users.push(user) // adicionar o usuário no array
    return response.status(201).json(user) // retornar apenas o usuário que foi criado
})                      //☝🏻 Retornar o status 201 (criado)

app.put('/users/:id', checkUserId, (request, response) => { // Criar Rota(put): Configurar nova requisição(insomnia, ou similar);
    const {name, age} = request.body // Obter informações a serem atualizadas (name e age) pelo body

    const index = request.userIndex //Index do usuário

    const id = request.userId // Id do usuário

    const updateUser = {id, name, age} // Criar objeto com as informações atualizadas;

    users[index] = updateUser // Inserir usuário atualizado dentro do array;
    return response.json(updateUser) // Retornar usuário atualizado (mostra em tela).
    console.log(index) 

    return response.json(users)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index,1) // Apagar apenas o id fornecido

    return response.status(204).json() // Retornar status 204 - informação deletada com sucesso e sem conteúdo
})


app.listen(3000, () => {
    console.log(`😎 Server started on port ${port}`)
})