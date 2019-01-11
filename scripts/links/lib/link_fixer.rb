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
    content.gsub(
      link,
      redirect_301.follow_redirect(link: link)
    )
  end
end
