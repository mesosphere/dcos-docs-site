#!/usr/bin/ruby
file_names = Dir["pages/1.11/**/*.md"]
puts file_names
puts "Number of files: #{file_names.count}"

word_count = 0

file_names.each do |filename|
  file = File.open(filename)
  num_section_breaks = 0
  in_code_break = false

  file.each_line do |line|
    num_section_breaks += 1 if line == "---\n"
    in_code_break = !in_code_break if line.include?('```')

    if num_section_breaks > 1 && !in_code_break
      word_count += line.split.count
    end
  end
end

puts "Word count: #{word_count}"
