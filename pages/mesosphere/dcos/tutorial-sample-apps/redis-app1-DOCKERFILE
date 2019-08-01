FROM python
RUN apt-get update && apt-get -y install python-pip && pip install redis
ENTRYPOINT ["/usr/bin/redis-server"]
