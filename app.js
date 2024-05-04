// app.js
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const axios = require('axios');

const typeDefs = gql`
  type Weather {
    city: String!
    temperature: Float!
    description: String!
  }

  type Query {
    getWeatherByCityName(city: String!): Weather!
  }
`;

const resolvers = {
  Query: {
    getWeatherByCityName: async (_, { city }) => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5cad434697f1def9900049dc08df685a&units=metric`);
        const { main, weather, name } = response.data;
        const cityName = name || response.data.name; // Use response.data.name if name is not found

        return {
          city: cityName,
          temperature: main.temp,
          description: weather[0].description
        };
      } catch (error) {
        throw new Error("Failed to fetch weather data");
      }
    }
  }
};


const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});

// import { expect } from 'chai';
// import { ApolloServer, gql } from 'apollo-server-express';
// import axios from 'axios';
// import express from 'express';
// import { createTestClient } from 'apollo-server-testing';

// const typeDefs = gql`
//   type Weather {
//     city: String!
//     temperature: Float!
//     description: String!
//   }

//   type Query {
//     getWeatherByCityName(city: String!): Weather!
//   }
// `;

// const resolvers = {
//   Query: {
//     getWeatherByCityName: async (_, { city }) => {
//       try {
//         const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5cad434697f1def9900049dc08df685a&units=metric`);
//         const { main, weather, name } = response.data;
//         const cityName = name || response.data.name; // Use response.data.name if name is not found

//         return {
//           city: cityName,
//           temperature: main.temp,
//           description: weather[0].description
//         };
//       } catch (error) {
//         throw new Error("Failed to fetch weather data");
//       }
//     }
//   }
// };

// describe('Weather API', () => {
//   let server;
//   let query;

//   before(async () => {
//     const app = express();
//     const apolloServer = new ApolloServer({ typeDefs, resolvers });
//     await apolloServer.start();
//     apolloServer.applyMiddleware({ app });
//     server = app.listen({ port: 4000 }); // Listen on a specific port
//     query = createTestClient(apolloServer).query;
//   });

//   after(() => {
//     server.close();
//   });

//   it('returns weather data for a valid city', async () => {
//     const cityName = 'London';
//     const { data, errors } = await query({ query: `query { getWeatherByCityName(city: "${cityName}") { city, temperature, description } }` });

//     expect(errors).to.be.undefined;
//     expect(data.getWeatherByCityName).to.have.property('city').equal(cityName);
//     expect(data.getWeatherByCityName).to.have.property('temperature');
//     expect(data.getWeatherByCityName).to.have.property('description');
//   });

//   it('throws an error for an invalid city', async () => {
//     const cityName = 'InvalidCityName';
//     const { errors } = await query({ query: `query { getWeatherByCityName(city: "${cityName}") { city, temperature, description } }` });

//     expect(errors[0].message).to.equal('Failed to fetch weather data');
//   });
// });

