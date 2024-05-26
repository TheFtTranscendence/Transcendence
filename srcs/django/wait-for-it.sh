#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available
#
# License: MIT
# https://github.com/vishnubob/wait-for-it

TIMEOUT=15
quiet=0
host="$1"
port="$2"
shift 2

while [[ $1 = -* ]]; do
  case "$1" in
    -q|--quiet) quiet=1 ;;
    -t|--timeout) TIMEOUT="$2" ; shift ;;
    --) shift ; break ;;
    -*) echo "Unknown option: $1" ; exit 1 ;;
  esac
  shift
done

wait_for() {
  for i in `seq $TIMEOUT` ; do
    nc -z "$host" "$port" > /dev/null 2>&1
    result=$?
    if [[ $result -eq 0 ]] ; then
      if [[ $quiet -ne 1 ]] ; then echo "wait-for-it: $host:$port is available after $i seconds" ; fi
      return 0
    fi
    sleep 1
  done
  echo "wait-for-it: timeout occurred after waiting $TIMEOUT seconds for $host:$port"
  return 1
}

wait_for
