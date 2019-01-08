require 'byebug'
require_relative 'redirect'

class RedirectRegex < Redirect
  def match?(link:)
    exact_regex.match(link)
  end

  def replace(content:)
    content.gsub(contains_regex, gsub_markdown_replacement)
  end

  def exact_regex
    Regexp.new(pre)
  end

  def gsub_markdown_replacement
    #"[\\k<text>](#{post})"
    gsub_compatible = post.gsub("$1", '\\\2')
    "[\\1](#{gsub_compatible})"
  end

  def contains_regex
    regex = pre

    if regex.start_with?('^')
      regex = regex[1..-1]
    end
    if regex.end_with?('$')
      regex = regex[0..-2]
    end
    # TODO: replace capture group with name
    # regex_str = "\\[(?<text>.*)\\]\\(#{regex}\\)"
    regex_str = "\\[(.*)\\]\\(#{regex}\\)"
    Regexp.new(regex_str)
  end
end
