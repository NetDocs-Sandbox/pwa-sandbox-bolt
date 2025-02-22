import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

const users = [
  {
    id: '1',
    name: 'Sarah Anderson',
    email: 'sarah.anderson@law.com',
    password: bcrypt.hashSync('password123', 10),
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    role: 'Senior Partner'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@law.com',
    password: bcrypt.hashSync('password123', 10),
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
    role: 'Associate'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@law.com',
    password: bcrypt.hashSync('password123', 10),
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
    role: 'Partner'
  }
];

const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    avatarUrl: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
  }

  type Query {
    me: User
  }
`;

const resolvers = {
  Query: {
    me: (_, __, { user }) => user,
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: user.role
        }
      };
    }
  }
};

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const auth = req.headers.authorization || '';
    if (auth.startsWith('Bearer ')) {
      try {
        const token = auth.slice(7);
        const { userId } = jwt.verify(token, JWT_SECRET);
        const user = users.find(u => u.id === userId);
        return { user };
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
    return { user: null };
  }
});

await server.start();

app.use('/graphql', 
  cors(),
  express.json(),
  expressMiddleware(server)
);

app.listen(4000, () => {
  console.log('🚀 Server ready at http://localhost:4000/graphql');
});