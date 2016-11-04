
function ServerCallAvailable(limit, funcName, args) {
  if (!limit) limit = 95;

  let currentTime = Date.now();

  while (ListServerCalls.length > 0 && ListServerCalls[0] < currentTime)
    ListServerCalls.shift();

  if (ListServerCalls.length < limit)
    return true;
  else
    return false;
}

function ServerCallAdd(expire) {
  ListServerCalls.push(expire);
}

function Emit(cmd, args) {
  if (ServerCallAvailable()) {
    ServerCallAdd(Date.now() + 3000, "Emit", [cmd, args]);
    get_socket().emit(cmd, args);
  }
}

function TryServerCall(call, name, args) {
  if (ServerCallAvailable()) {
    ServerCallAdd(Date.now() + 3000, name, args)
    call();
    return true;
  }
  return false;
}

function Move(x, y) {
  return TryServerCall(() => move(x, y), "Move", [x, y]);

  // if (ServerCallAvailable()) {
  //   ServerCallAdd(Date.now() + )
  // }
}
