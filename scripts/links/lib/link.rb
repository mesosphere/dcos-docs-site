class Link
  WEBPAGE_REGEX = "[A-z0-9/:.\\-_%&?#]+?".freeze

  def self.inline_link_regex(link:, escape: true)
    interpolation = escape ? escape_regex(link) : link

    Regexp.new("\\[.+?\\]\\((#{interpolation})\\)")
  end

  def self.reference_link_regex(link:, escape: true)
    interpolation = escape ? escape_regex(link) : link

    Regexp.new("\\[[0-9]+\\]: (#{interpolation})$")
  end

  def self.escape_regex(link:)
    link
  end

  def self.webpage_regex_str
    WEBPAGE_REGEX
  end

end
