/*jshint node:true*/
module.exports = function(grunt) {
  'use strict';

  grunt.registerMultiTask('wrapamd', function() {
    var opts = this.options();
    this.files.forEach(function(f) {
      var output = ['(function(globals) {'];

      output.push.apply(output, f.src.map(grunt.file.read));

      output.push(grunt.template.process(
        'globals.<%= namespace %> = requireModule("<%= barename %>");', {
        data: {
          namespace: opts.namespace,
          barename: opts.barename
        }
      }));
      output.push('})(window);');

      grunt.file.write(f.dest, grunt.template.process(output.join('\n')));

      grunt.log.writeln('File "' + f.dest + '" created');
    });
  });
};
