require_relative 'redirect'

class RedirectRegex < Redirect
  def match?(link:)
    exact_regex.match(link)
  end
  
  def follow_redirect(link:)
    raise "Not a match" unless match?(link: link)
    link.gsub(Regexp.new(pre), post)
  end

  private

  def post
    @post.gsub('$', '\\')
  end

  def exact_regex
    Regexp.new(pre)
  end
end
