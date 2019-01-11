require_relative 'redirect'

class RedirectRegex < Redirect
  def match?(link:)
    pre_regex.match(link)
  end
  
  def follow_redirect(link:)
    raise "Not a match" unless match?(link: link)
    link.gsub(pre_regex, post)
  end

  private

  def post
    @post.gsub('$', '\\')
  end

  def pre_regex
    Regexp.new(pre)
  end
end
