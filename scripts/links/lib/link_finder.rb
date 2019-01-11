class LinkFinder
  WEBPAGE_REGEX = "[A-z0-9/:.\\-_%&?#]+?"
  INLINE_LINK_REGEX = Regexp.new("\\[.+?\\]\\((#{WEBPAGE_REGEX})\\)")
  REF_LINK_REGEX = Regexp.new("\\[[0-9]+\\]: (#{WEBPAGE_REGEX})$")

  def initialize(content:)
    @content = content
  end

  def links
    inline_links #+ reference_links
  end

  def reference_links
    find_links(regex: REF_LINK_REGEX)
  end

  def inline_links
    find_links(regex: INLINE_LINK_REGEX)
  end

  def find_links(regex:)
    content.scan(regex).map do |capture_group|
      capture_group[0]
    end
  end

  private

  attr_reader :content
end
