#!/usr/bin/ruby
file_names = Dir["#{ARGV[0]}/**/*.md"]
puts "Number of files: #{file_names.count}"

word_count = 0

# curr_package = ""
# curr_version = ""

file_names.each do |filename|
  # next if filename.include?('beta')
  # path = filename.split('/')
  # if path[2] != curr_package || path[3] != curr_version
  #   puts "#{curr_package} #{curr_version} #{word_count}"
  #   curr_package = path[2]
  #   curr_version = path[3]
  #   word_count = 0
  # end

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
