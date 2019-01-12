require_relative 'link'

class LinkFinder
  def initialize(content:)
    @content = content
  end

  def links
    inline_links + reference_links
  end

  def reference_links
    find_links(type: :reference)
  end

  def inline_links
    find_links(type: :inline)
  end

  def find_links(type:)
    regex = Link.regex_for(type: type)

    content.scan(regex).map do |capture_group|
      Link.new(url: capture_group[1])
    end
  end

  private

  attr_reader :content
end
