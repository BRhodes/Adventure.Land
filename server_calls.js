var ListServerCalls = [];
var ServerCallLimit = 155;
var ServerCallLimitDuration = 4000;

function ServerCallAvailable(limit, funcName, args) {
  if (!limit) limit = ServerCallLimit;

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

function TryServerCall(call, name, args) {
  if (ServerCallAvailable()) {
    ServerCallAdd(Date.now() + ServerCallLimitDuration, name, args)
    call();
    return true;
  }
  return false;
}

function Move(x, y) {
  return TryServerCall(() => move(x, y), "Move", [x, y]);
}

function Emit(cmd, args) {
  return TryServerCall(() => get_socket().emit(cmd, args), "Emit", [cmd, args]);
}
