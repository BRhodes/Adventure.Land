function PartyInvite(characterName) {
	if (characterName == character.name) return false;
	var char=get_player(characterName);
	if (char && !char.party) {
		get_socket().emit("party", {event:"invite", id: char.id});
		return true;
	}
  return false;
}

function PartyManagement() {
	if (character.name == partyLeader) {
		if (PartyInvite("Vehnato")
		   ||PartyInvite("Vehnifer")
		   ||PartyInvite("Vehn")
		   ||PartyInvite("Valazi")
		   ||PartyInvite("Dinasis")) return true;
	} else {
		if (!character.party) {
			get_socket().emit("party", {event:"accept", name:partyLeader});
			return true;
		}
		if (character.party != partyLeader) {
			get_socket().emit("party", {event:"leave"});
			return true;
		}
	}

	return false;
}
