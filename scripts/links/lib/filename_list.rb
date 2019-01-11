require 'set'

class FilenameList
  def initialize(file_pattern:)
    @file_pattern = file_pattern
    @filename_set = Dir[file_pattern].to_set
  end

  def include?(filename:)
    filename_set.include?(filename)
  end

  def file_exists_for?(url:)
    filename = "pages#{url}index.md"
    include?(filename: filename)
  end

  def each(&prc)
    @filename_set.each(&prc)
  end

  private

  attr_reader :filename_set
end
