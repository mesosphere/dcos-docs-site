class Link
  WEBPAGE_REGEX = "[A-z0-9/:.\\-_%&?#]+?".freeze

  attr_reader :url

  def self.webpage_regex_str
    WEBPAGE_REGEX
  end

  def self.regex_for(type:)
    link = self.new(
      url: self.webpage_regex_str
    )
    link.regex(type: type, escape: false)
  end

  def initialize(url:)
    @url = url
  end

  def regex(type:, escape: true)
    case type
    when :inline
      inline_regex(escape: escape)
    when :reference
      reference_regex(escape: escape)
    else
      raise "link type not found"
    end
  end

  def replacement(type:)
    case type
    when :inline
      inline_replacement
    when :reference
      reference_replacement
    else
      raise "link type not found"
    end
  end

  private

  def inline_regex(escape: true)
    interpolation = escape ? escape_regex(url: url) : url

    Regexp.new("\\[(.+?)\\]\\((#{interpolation})\\)")
  end

  def inline_replacement
    "[\\1](#{url})"
  end

  def reference_regex(escape:)
    interpolation = escape ? escape_regex(url: url) : url

    Regexp.new("\\[([0-9]+)\\]: (#{interpolation})\\n")
  end

  def reference_replacement
    "[\\1]: #{url}\n"
  end

  def escape_regex(url:)
    url
  end

end
