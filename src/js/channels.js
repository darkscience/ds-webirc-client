import Immutable from 'immutable';

/**
 * @param type One of: network, normal, phony
 */
export function createChannel(type, name, topic, users=[]) {
  return Immutable.Map({
    type,
    name,
    topic,
    users: Immutable.List.of(users)
  });
}
