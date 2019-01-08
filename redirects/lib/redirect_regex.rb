require_relative 'redirect'

class RedirectRegex < Redirect
  def match?(link:)
    exact_regex.match(link)
  end

  def replace(content:)
    content.gsub(contains_regex, post)
  end

  def exact_regex
    Regexp.new(pre)
  end

  def contains_regex
    regex = pre

    if regex.start_with?('^')
      regex = regex[1..-1]
    end
    if regex.end_with?('$')
      regex = regex[0..-2]
    end

    Regexp.new(regex)
  end
end
