const baseCommand = ['/bin/sh', '-c'];

export const commands: Record<string, (code: string) => string[]> = {
	python: function (code) {
		const runCommand = `echo '${code}' > code.py && python3 code.py`;
		return [...baseCommand, runCommand];
	},
	cpp: function (code) {
		const runCommand = `echo '${code}' > code.cpp && g++ code.cpp -o code && ./code`;
		return [...baseCommand, runCommand];
	},
	java: function (code) {
		const runCommand = `echo '${code}' > code.java && javac code.java && java code`;
		return [...baseCommand, runCommand];
	},
};
