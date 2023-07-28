/* eslint-disable jsdoc/require-jsdoc */
import { Indexable } from "yorkie-js-sdk";

export function displayPeers(
  peers: Array<{ clientID: string; presence: Indexable }>,
) {
  let users = [];
  for (const { presence } of peers) {
    users.push(presence.userName);
  }

  return users;
}
