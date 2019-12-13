require 'byebug'
require_relative 'lib/redirect_map'
require_relative 'lib/filename_list'
require_relative 'lib/link_finder'

filename_list = FilenameList.new(
  file_pattern: 'pages/**/*.{md,tmpl,png}'
)

redirect_map = RedirectMap.new(
  filename_301: 'docker/nginx/redirects-301.map',
  filename_307: 'docker/nginx/redirects-307.map',
  existing_filenames: filename_list
)

# Each file

all_not_found = []

filename_list.each do |filename|
  next if filename.end_with?('png')

  file_content = File.read(filename)

  links = LinkFinder.new(content: file_content).links

  fixers, not_found = redirect_map.find_fixers(links: links)

  not_found_local = not_found.reject do |link|
    link.url.start_with?("#", "http", ".")
  end

  all_not_found.concat(not_found_local)

  new_content = file_content

  fixers.each do |fixer|
    new_content = fixer.replace(content: new_content)
  end

  File.write(filename, new_content)
end

puts
if all_not_found.count > 0
  puts "Could not find redirects for:"
  puts all_not_found.map(&:url)
else
  puts "Redirects found for all links"
end
puts
