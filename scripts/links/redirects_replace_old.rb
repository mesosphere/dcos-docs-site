require_relative 'lib/redirect_map'
require_relative 'lib/filename_list'

filename_list = FilenameList.new(
  file_pattern: 'pages/**/*.{md,tmpl,png}'
)

redirect_map = RedirectMap.new(
  filename_301: 'docker/nginx/redirects-301.map',
  filename_307: 'docker/nginx/redirects-307.map',
  existing_filenames: filename_list
)

# Each file

LINK_REGEX = Regexp.new('\[.*\]\((.*)\)')

all_not_found = []

filename_list.each do |filename|
  next if filename.end_with?('png')

  # filename = 'pages/example-snippets/index.md'
  file_content = File.read(filename)

  links = file_content.scan(LINK_REGEX).map do |capture_group|
    capture_group[0]
  end

  redirects, not_found = redirect_map.find(data: links)
  all_not_found.concat(not_found)

  new_content = file_content

  redirects.each do |redirect|
    new_content = redirect.replace_markdown_link(content: new_content)
  end

  File.write(filename, new_content)
end

puts
if all_not_found.count > 0
  puts "Could not find redirects for:"
  puts all_not_found
else
  puts "Redirects found for all links"
end
puts
