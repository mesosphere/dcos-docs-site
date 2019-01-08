require_relative 'lib/redirect_map'
require_relative 'lib/filename_list'

filename_list = FilenameList.new(file_pattern: 'pages/**/*.{md,tmpl}')

redirect_map = RedirectMap.new(
  redirect_filename: 'docker/nginx/redirects-301.map',
  existing_filenames: filename_list
)

# Each file

LINK_REGEX = Regexp.new('\[.*\]\((.*)\)')

#filename_set.each do |filename|

filename = 'pages/example-snippets/index.md'
  file_content = File.read(filename)

  links = file_content.scan(LINK_REGEX).map do |capture_group|
    capture_group[0]
  end

  redirects = redirect_map.find(data: links)

  new_content = file_content

  redirects.each do |redirect|
    new_content = redirect.replace(content: new_content)
  end

  File.write(filename, new_content)
#end
