class RedirectFixer

  attr_accessor :redirect_307, :redirect_301

  def initialize(link:)
    @original_link = link
  end

  def link
    if has_redirect_307?
      # TODO: replace and save in instance variable
      original_link
    else
      original_link
    end
  end

  def replace(content:)
    # TODO: replace 307
    redirect_301.replace(content: content)
    # TODO: unreplace 307
  end

  def has_redirect_307?
    !!redirect_307
  end

  def has_redirect_301?
    !!redirect_301
  end

  private

  attr_reader :original_link
end
