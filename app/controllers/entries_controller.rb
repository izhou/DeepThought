class EntriesController < ApplicationController
  respond_to :json

  def index
    @entries = Entry.all
    render json: @entries
  end

  def show
    @entry = Entry.find(params[:id])
    render json: @entry
  end

  def create
    @entry = Entry.create(params[:entry])
    @entry.parent.child_ids.append(@entry.id)
    
    render json: @entry
  end

end
