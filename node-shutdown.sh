PID=`ps aux | grep node | grep app | awk '{print $2}'`
echo "Kill node: " $PID
sudo kill $PID       