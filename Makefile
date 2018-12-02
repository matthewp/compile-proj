
demo:
	node test/test.js > demo/helloworld.js
	cat demo/helloworld.js
.PHONY: demo

demo-debug:
	node --inspect-brk test/test.js
.PHONY: demo-debug