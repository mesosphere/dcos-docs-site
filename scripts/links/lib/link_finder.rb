require_relative 'link'

class LinkFinder
  def initialize(content:)
    @content = content
  end

  def links
    inline_links #+ reference_links
  end

  def reference_links
    regex = Link.reference_link_regex(
      link: Link.webpage_regex_str,
      escape: false
    )
    find_links(regex: regex)
  end

  def inline_links
    regex = Link.inline_link_regex(
      link: Link.webpage_regex_str,
      escape: false
    )
    find_links(regex: regex)
  end

  def find_links(regex:)
    content.scan(regex).map do |capture_group|
      capture_group[1]
    end
  end

  private

  attr_reader :content
end
