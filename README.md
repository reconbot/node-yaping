node-yaping
===========

yaping is yet another ping utility for nodejs

I wouldn't use it if I were you. I don't even use it and I'm me. I'm pushing this to further my
dream of raw sockets in node. When that day arrives I'll port a random python icmp ping implementation to node, check the pcap caputres against
the unix ping utility and call it a day.

In actuality, that will only be the start of my day. I'll also create a ping response server that lies about how fast
it responds. ([You can totally do that](http://en.wikipedia.org/wiki/Ping#Payload), it's awesome.) All my servers
will show negative latency, and you can't prove it's a lie.

This simple function should
  * do dns lookups
  * ping once
  * timeout after 10 seconds
  * communicate all the well though out error codes that ping provides
  * spawn a child processes out of wedlock

Patches/Pull requests welcome.
