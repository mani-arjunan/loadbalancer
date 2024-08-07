
REQUESTS=30

URL="localhost:8000"


for ((i = 0; i < REQUESTS; i++)); do
  curlcmd="curl --header 'X-Request-Id: $i' $URL &"
  eval $curlcmd
done

wait
echo "All requests completed"
