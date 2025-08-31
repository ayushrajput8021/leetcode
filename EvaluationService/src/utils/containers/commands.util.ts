export const commands: Record<string, (code: string) => string[]> = {
	python: function (code) {
		const runCommand = `echo '${code}' > code.py && python3 code.py`;
		return ['/bin/sh', '-c', runCommand];
	},
	cpp: function (code) {
		const runCommand = `echo '${code}' > code.cpp && g++ code.cpp -o code && ./code`;
		return ['/bin/sh', '-c', runCommand];
	},
	java: function (code) {
		const runCommand = `echo '${code}' > code.java && javac code.java && java code`;
		return ['/bin/sh', '-c', runCommand];
	},
};
