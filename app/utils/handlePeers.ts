/* eslint-disable jsdoc/require-jsdoc */
import { Indexable } from "yorkie-js-sdk";

const RANDOM_PEERS = [
  "John",
  "Alice",
  "Steven",
  "Kate",
  "Daniel",
  "Chang",
  "Marie",
  "Fred",
  "Sanchez",
  "Kim",
  "Wayne",
  "Seon",
  "Diaz",
  "Tom",
];

export function displayPeers(
  peers: Array<{ clientID: string; presence: Indexable }>,
) {
  let users = [];
  for (const { presence } of peers) {
    users.push(presence.userName);
  }

  return users;
}

export function createRandomPeers() {
  const index = Math.floor(Math.random() * RANDOM_PEERS.length);

  return RANDOM_PEERS[index];
}
