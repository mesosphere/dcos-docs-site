require_relative 'link'

class LinkFixer
  attr_reader :link
  attr_accessor :redirect_307, :redirect_301

  def initialize(link:)
    @link = link
  end

  def replace(content:)
    content = replace_301(content: content)

    content
  end

  def has_redirect_307?
    !!redirect_307
  end

  def has_redirect_301?
    !!redirect_301
  end

  private

  def replace_301(content:)
    # Can't just replace link with redirected link or it will include other
    # links that include that link in its path
    redirected_link = redirect_301.follow_redirect(link: link)

    debugger

    inline_fixed = content.gsub(
      link.regex(type: :inline),
      redirected_link.replacement(type: :inline)
    )

    inline_fixed.gsub(
      link.regex(type: :reference),
      redirected_link.replacement(type: :reference)
    )
  end
end
