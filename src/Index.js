const express = require("express")

const app = express()
let pokemons = [
    {
        id: 25,
        nombre: "Pikachu",
        tipo: ["Eléctrico"],
        altura_m: 0.4,
        peso_kg: 6,
        descripcion: "Pokémon ratón que almacena electricidad en sus mejillas. Evoluciona en Raichu."
    },
    {
        id: 4,
        nombre: "Charmander",
        tipo: ["Fuego"],
        altura_m: 0.6,
        peso_kg: 8.5,
        descripcion: "Lagarto de fuego cuya llama en la cola refleja su vitalidad. Evoluciona en Charizard."
    },
    {
        id: 1,
        nombre: "Bulbasaur",
        tipo: ["Planta", "Veneno"],
        altura_m: 0.7,
        peso_kg: 6.9,
        descripcion: "Tiene una semilla en la espalda que crece al evolucionar. Evoluciona en Venusaur."
    },
    {
        id: 7,
        nombre: "Squirtle",
        tipo: ["Agua"],
        altura_m: 0.5,
        peso_kg: 9,
        descripcion: "Tortuga que dispara agua a presión y se protege en su caparazón. Evoluciona en Blastoise."
    },
    {
        id: 133,
        nombre: "Eevee",
        tipo: ["Normal"],
        altura_m: 0.3,
        peso_kg: 6.5,
        descripcion: "Pokémon con código genético inestable, puede evolucionar en varias formas."
    }
];
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.get("/api/v1/pokemon", (request, response) => {
    response.json({ pokemons })
})

app.post("/api/v1/pokemon", (request, response) => {
    try {
        const {
            id, nombre, tipo, altura_m, peso_kg, descripcion
        } = request.body
        const existe_id = pokemons.find(pokemon => pokemon.id == id)
        const existe_nombre = pokemons.find(pokemon => pokemon.nombre == nombre)
        if (existe_id || existe_nombre) {
            return response.status(400).json({ error: "pokemon duplicado" })
        }
        pokemons.push({ id, nombre, tipo, altura_m, peso_kg, descripcion })
        response.status(201).json({ id, nombre, tipo, altura_m, peso_kg, descripcion })
    } catch (Error) {
        console.log(typeof Error)
        response.status(500).json({ error: Error.message })
    }

})

app.delete("/api/v1/pokemon/:id", (request, response) => {
    try {
        const { id } = request.params
        const existe_id = pokemons.findIndex(pokemon => pokemon.id == id)
        if (existe_id == -1) {
            return response.status(404).json({ error: "Pokemon no encontrado" })

        }
        console.log(10)
        pokemons.splice(existe_id, 1)
        return response.status(204).send()

    } catch (Error) {
        console.log(Error)
    }
})

app.patch("/api/v1/pokemon/:id", (request, response) => {
    try {
        const { id } = request.params
        const pokemon = pokemons.find(pokemon => pokemon.id == id)
        if (!pokemon) throw new Error(404)
        const {
            nombre, tipo, altura
        } = request.body
        if (nombre !== undefined){
            if (typeof nombre !== "string" || !nombre.trim()){
                throw new Error(400)
            }
            pokemon.nombre = nombre.trim()
        }
        if (tipo !== undefined){
            if (!Array.isArray(tipo) || !tipo.every(t => typeof t === "string")){
                throw new Error(400)
            }
            pokemon.tipo = tipo
            
        }
        if (altura !== undefined){
            if (typeof altura !== "number"){
                throw new Error(400)
            }
            pokemon.altura_m = altura
            
        }
        return response.status(204).send()



    } catch (Error) {
        console.log(typeof Error.message)
        return response.status(Number(Error.message)).send()
    }
})

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000")
})