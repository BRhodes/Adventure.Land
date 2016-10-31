function RelativeMove(relX, relY) {
  move(character.real_x + relX, character.real_y + relY);
}

function Follow(char, distance, followMovement) {
  if (!char) return;
  var dist_x=character.real_x - char.real_x;
  var dist_y=character.real_y - char.real_y;

  var from_char=sqrt(dist_x*dist_x + dist_y*dist_y);

  if (followMovement && char.moving) distance = 1;

  var perc=from_char/distance;

  if (perc > 1.01) {
    RelativeMove(-(dist_x-dist_x/perc), -(dist_y-dist_y/perc));
    //change_target("");
    //set_message("Following");
    return true;
  }
  return false;
};

function FollowName(charName, distance, followMovement) {
  var char=get_player(charName);
  return Follow(char, distance, followMovement);
}

function Transport(map) {
  if (Awake(Transport) && character.map != map) {
    Sleep(Transport, 1000);
    get_socket().emit("transport", {to: "bank"});
    return false;
  } else {
    return true;
  }
}
