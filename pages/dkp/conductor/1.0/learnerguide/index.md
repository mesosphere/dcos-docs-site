---
navigationTitle: Learner's Guide
title: Learner's Guide
menuWeight: 50
excerpt: A guide to navigating content and using the interactive learning environment
---

# Overview

Welcome to Conductor!

Your cloud native adventure begins here.

# First-time login

As a new learner on your organization's Conductor service, you will be receiving - or already have received - a sign up link from one of your organization's administrators inviting you to sign up for Conductor.

## Logging In/Out

After you follow the link and sign up using your email and password, you can log in to Conductor from the login screen and you will be brought to your Mission Control page.

To log out, select the **Logout** item from the user 👤 dropdown at the far right-hand of the side of the main navbar.

If you forget your password, you will need to contact your administrator for a special link to reset your password.

**NOTE**: Upon logging out, any clusters you are interacting with will be shut down and you will lose any progress that was not yet recorded at the end of a unit.

# Navigating Content

Including the navbar, there are four main levels when navigating content:

## Navbar

The **Navbar** can be accessed from anywhere in Conductor other than login page.

- *Logo*: When navigating content, if you select the D2iQ Conductor logo in the navbar, it will redirect you back to **Mission Control**.

- *Feedback:* When you select the **Feedback** button to the right side of the navbar, you will be redirected to a Google form, where you can report feedback about Conductor for our Product team to use for product improvements.

- *D2iQ.com:* Redirects to D2iQ.com's main landing page.

- 👤: dropdown that can bring you to the Admin Portal or can log you out.

## Mission Control

Mission Control provides a top-down view of your content by displaying (in order from the top-of-page down):

  1. **Courses in Progress** - all courses for which you have already began a unit
  1. **All Available Courses** - all courses of which you can take
  1. **Completed Courses** - courses for which you have already completed all units
  1. **Upcoming Courses** - courses coming in a future content update to Conductor

Select a course to view that course's Course Page.

## Course Pages

A *Course Page* gives the basic high-level information about the course - `<total time in hours> | <total unit count>`- including a list of the course's units with corresponding summary of learning objectives for completing the unit.

Select a unit to view that unit's *Unit Launch Page*.

## Unit Launch Pages

A unit's *Unit Launch Page* is the threshold between navigating the available content and committing to a specific unit.

For interactive units, you will be presented with a modal letting you know about how long you can expect to have your interactive environment spun up and ready for you.

If you are already engaged with another unit, you will not be allowed to start another unit without completing or quitting the other first.

# Integrated Learning Environment

After you **Start** the unit from the *Unit Launch Page,* you will be presented with a single-page learning environment - called the *Integrated Learning Environment* (ILE) - where most of the actual learning takes place - text, video, and CLI interactions, as well as various knowledge checks, environmental validations, and links out to external resources.

The ILE can be split into two to three main sections, depending on whether or not a step utilizes CLI or file system interactivity:

  1. **Nav Menu sidebar** - for navigating through steps: looking ahead or behind your current place
  1. **Content Pane** - in either full or half pane, depending on CLI or file system interactivity
  1. **Interactive Portal** - for CLI and/or file system interactivity

## Nav Menu

The *Nav Menu* sidebar on the left side of the ILE allows you to view around at steps other than the one you are currently attempting to progress through - whether they are ahead of where you are or previous steps you have already completed.

**NOTE**: If you lose your place while navigating, don't worry. Select **Return** on the content pane you are currently viewing, and you will be returned to the step through which you are currently intended to progress.

## Content Pane

To the right of the *Nav Menu* sidebar is the *Content Pane* - in either `full-pane` or `half-pane` mode. In either mode, the purpose of the *Content Pane* is to supply any necessary content - whether text, images, videos, or external links - to progress to the next step of the unit.

In `full-pane` mode, the *Content Pane* takes up all the vertical space to the right of the *Nav Menu*.

In `half-pane` mode, the *Content Pane* takes up just the bottom portion of the vertical space, leaving room above it for the *Interactive Portal*.

### The Progress Button

When you are viewing the step through which you are currently intended to progress - your current place in the unit - you will see either the **Continue** button or the **Validate & Continue** button at the top of the *Content Pane*, depending upon the requirements for completing that step.

#### **Continue**

If you are currently at a step with a **Continue** button, then there is no environmental validation on this step. You need only consume the information there, and select **Continue** when ready.

#### **Validate & Continue**

If you are currently at a step with a **Validate and Continue** button, there are actions you need to complete in order to progress - whether that be answering questions (see Knowledge Checks below) or ensuring the cluster is in the right state specified in the current step (see Validations below).

#### **Return**

If you have navigated away from the step that you are intended to progress through to view another step, the step you have navigated to will have a **Return** button instead of a **Continue** or **Validate & Continue** button.

The **Return** button will take you back to your current place in the unit so you can continue to progress.

### Knowledge Checks

Sometimes at the end of a section, there will be a knowledge check in the form of a multiple choice quiz. On these steps, the **Validate and Continue** button will check your answers and let you know which you answered correctly and which you did not.

After all of your answers are correct, you will see the **Continue** button to proceed to the next section.

You cannot proceed past a knowledge check without answering all the questions correctly.

### Validations

Some steps require the environment to be in a particular state or another in order to proceed. For example, a step might require a Kubernetes pod exist, with some particular name.

To proceed on these steps, follow the CLI instructions for the step and crosscheck with the banner message received from an incorrect check, as it may help you find the specific discrepency (e.g. maybe it is checking for `pod-1` and you created `pod1` instead).

You cannot proceed past a validation step without your cloud environment being in the correct state.

### Recommendations

Some validation steps are key indicators to ensuring specific learning objectives are sufficiently conveyed. Because of this, on some validation steps, when you fail on one too often (some number of times), Conductor can suggest another unit or course to take that will teach the necessary information to progress.

Taking the recommendation  requires ejecting from the unit you are currently working on and taking another unit, possibly one that you have

**NOTE** Unless coded otherwise, if you fail a validation step three times, Conductor will recommend you go back to Mission Control to find the training you need to pass the validation step.

## Interactive Portal

In `half-pane` mode, you are able to see the *Interactive Portal* consisting of two tabs:

1. **Terminal**: the top `Terminal` tab shows the CLI connection ssh'd to the base environment of the current unit.

    This is where the main interactivity with the cluster takes place. For example, when working with Kubernetes interactive modules, this is the environment from which you will control your Kubernetes cluster using `kubectl`.

1. **File Editor**: the bottom `File Editor` tab shows all the folders/files from the root directory of the base enviroment.

    From this file editor, you view, make, and save edits to the various files in the root directory, so you don't need to use the CLI's `vim` to make such edits.
