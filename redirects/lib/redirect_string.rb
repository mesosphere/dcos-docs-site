require 'byebug'
require_relative 'redirect'

class RedirectString < Redirect
  def match?(link:)
    link == pre
  end

  def replace(content:)
    content.gsub(pre, post)
  end

  alias_method :replace_markdown_link, :replace
end
