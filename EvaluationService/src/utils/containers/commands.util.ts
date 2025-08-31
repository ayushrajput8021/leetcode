const baseCommand = ['/bin/sh', '-c'];

export const commands: Record<
	string,
	(code: string, input: string) => string[]
> = {
	python: function (code, input) {
		const runCommand = `echo '${code}' > code.py && echo '${input}' > input.txt && python3 code.py < input.txt`;
		return [...baseCommand, runCommand];
	},
	cpp: function (code, input) {
		const runCommand = `echo '${code}' > code.cpp && echo '${input}' > input.txt && g++ code.cpp -o code && ./code < input.txt`;
		return [...baseCommand, runCommand];
	},
	java: function (code, input) {
		const runCommand = `echo '${code}' > code.java && echo '${input}' > input.txt && javac code.java && java code < input.txt`;
		return [...baseCommand, runCommand];
	},
};
